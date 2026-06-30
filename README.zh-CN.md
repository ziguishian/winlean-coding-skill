# WinLean Coding Skill

WinLean Coding Skill 是一个可复用的 Coding Skill，目标是让 AI Agent 在 Windows 项目里更稳、更省 token、更少写臃肿代码。

核心原则：

- 先清场，再动手。
- Read less. Patch smaller. Reuse more. Verify every change.

## 1. 这个 Skill 解决什么问题

它主要解决两类问题。

Windows 可靠性问题：

- PowerShell、cmd、Git Bash、WSL shell 的行为不一致。
- 中文、emoji、Markdown、Prompt、模板字符串、本地化文件容易被 shell 编码破坏。
- UTF-8、UTF-8 BOM、GBK、CP936、历史编码可能混用。
- CRLF/LF 换行差异会导致精确替换失败。
- Windows 路径、转义、glob、管道和类 Unix 工具链不一致。
- 复杂 shell one-liner 很容易造成不可控修改。

AI 代码臃肿问题：

- Agent 容易读取 `node_modules`、`dist`、`build`、`.next`、`coverage` 等无关目录。
- 大文件、生成产物、二进制文件会浪费上下文。
- Agent 容易忽略框架能力、已有依赖、已有 utils、components、hooks、services。
- 常见问题本来有成熟库，Agent 却手写一大段原生实现。
- 简单需求容易被扩展成不必要的 helper、类型、adapter、service layer。

## 2. 适合什么时候使用

适合这些场景：

- 在 Windows、WSL、Git Bash、PowerShell、cmd 环境里写代码。
- 修改中文、emoji、Markdown、Prompt、模板字符串、i18n、YAML、JSON。
- 做精确文本替换，且编码或换行会影响结果。
- 希望减少上下文读取和 token 浪费。
- 希望 Agent 在写代码前先检查框架能力、公共库、项目已有依赖和已有工具。
- 希望改动更小、更容易 review、更容易验证。

## 3. 不适合什么时候使用

不要把它当成：

- 完整架构重写指南。
- 仓库级迁移框架。
- 项目工程规范的替代品。
- 自动依赖安装器。
- 生成产物管理工具。

如果任务是大型迁移、依赖升级或架构调整，可以继续使用 WinLean 的安全规则，但仍然需要单独制定项目级计划。

## 4. 模式

WinLean 支持三种模式：

| 模式 | 适用场景 | 行为 |
|---|---|---|
| `lite` | 小型低风险改动 | 控制上下文、最小 patch、最小验证 |
| `full` | 常规编码任务 | 启用 Windows Safe Mode、Dependency Scout、Safe Patch Agent、Diff Reviewer |
| `audit` | 只审查计划或 diff | 不改文件，只报告 Windows 风险、token 浪费、依赖决策和过度设计 |

如果用户没有指定模式，默认使用 `full`。

## 5. Agent 工作流解释

`SKILL.md` 定义了六个阶段。

### Environment Doctor

判断当前系统和 shell：Windows、WSL、Linux、macOS；PowerShell、cmd、Git Bash、WSL shell 等。

如果任务涉及中文、emoji、Markdown、Prompt、模板字符串、本地化、精确替换或未知编码，并且运行环境是 Windows 或 Windows 路径，就进入 Windows Safe Mode。

### Context Gatekeeper

控制读取范围。默认不要读依赖目录、生成目录、缓存、二进制、图片、压缩包和 lock file，除非任务确实需要。

每次读取文件前都要有理由。优先读取用户点名文件、`package.json`、入口文件、相关源码、附近测试和已有 helper，而不是全仓库扫描。

### Dependency Scout

Dependency Scout 替代原来的 Library Scout。它要求 Agent 在写自定义代码之前先判断能否复用。

决策优先级：

1. 框架官方能力。
2. 官方推荐库。
3. 成熟开源库。
4. 项目已有依赖。
5. 项目已有工具函数、组件、hook、service。
6. 小型本地实现。
7. 大型手写实现，只有没有合适方案时才允许。

#### Internal Reuse Scout

检查项目内部可复用内容：

- `package.json` 和 workspace manifest。
- 项目已经安装的依赖。
- 已有 utils、components、hooks、services、validators、formatters、test helpers、adapters。
- 项目正在使用的框架原生能力。
- 附近代码风格和约定。

如果项目里已经有合适能力，优先复用，不要换个名字重复实现。

#### Public Library Scout

Public Library Scout 判断网络生态里是否已经有成熟库解决当前问题。

在写自定义代码前，Agent 必须判断：

1. 这个问题是不是常见问题？
2. 是否已经有成熟开源库可以解决？
3. 是否有官方库、行业常用库或框架推荐方案？
4. 使用库是否比手写更安全、更短、更可维护？
5. 引入库的成本是否值得？

以下领域必须优先考虑成熟库或官方能力：日期、时间、时区、表单校验、Markdown、HTML、AST、CSV、Excel、PDF、图片处理、颜色转换、拖拽排序、富文本、i18n、加密、哈希、鉴权、schema、diff、patch、文本转换、CLI 参数解析、日志、数据可视化、状态机、搜索、模糊匹配、文件上传、断点续传、URL、query string、复杂动画、虚拟列表、代码高亮、测试 mock。

规则：

- 不要为了 5 行简单逻辑引入新库。
- 不要为了炫技引入重型库。
- 不要自动安装生产依赖，必须先说明理由并请求用户确认。
- 如果没有联网能力，必须明确说明无法验证外部库，不能编造库信息。
- 如果推荐外部库，必须说明为什么推荐、解决什么问题、相比手写节省什么、风险是什么、是否需要新增依赖、安装命令和最小使用示例。

### Minimal Planner

修改前先说明：

- 要解决什么问题。
- 需要改哪些文件。
- 不会改哪些文件。
- 是否可以复用框架能力、公共库、已有依赖、已有组件或工具。
- 最小实现路径。
- 最小验证命令。

原则：

- 能改 1 个文件，不改 3 个文件。
- 能改 20 行，不改 200 行。
- 能局部 patch，不整文件重写。
- 不为未来可能需要的能力新建抽象。
- 修 bug 时找根因，不只修表面症状。

### Safe Patch Agent

执行安全修改。

Windows 下：

- 不用 PowerShell one-liner 替换中文、emoji、Markdown、Prompt、模板字符串或本地化内容。
- 不通过终端管道传非 ASCII 替换文本。
- 小改动优先使用 patch。
- 复杂替换使用 Node.js 或 Python，并显式 UTF-8 读写。
- 保持语义、编码预期和换行风格。
- 路径处理优先使用 Node.js `path` 或 Python `pathlib` 这类跨平台 API。

代码上：

- 不添加未使用 helper。
- 不添加未使用类型。
- 不添加不必要 class。
- 不重复实现已有逻辑。
- 不大段重写。
- 行为不变时，删除通常比新增更好。

### Diff Reviewer

修改完成后检查：

- 是否只改了必要文件。
- 是否误读或误改生成目录、依赖目录。
- 是否进行了没有必要的整文件重写。
- 是否执行了 Dependency Scout。
- 是否新增了不必要依赖。
- 是否有意处理编码和换行。
- 是否引入 Windows 不稳定命令。
- 是否运行了最小必要验证，或说明为什么无法运行。

## 6. Windows Safe Mode 说明

当 Windows 路径或 shell 遇到非 ASCII 或文本敏感文件时，进入 Windows Safe Mode。

典型触发条件：

- 中文文本。
- emoji。
- Markdown。
- Prompt 文件。
- 模板字符串。
- 本地化文件。
- 含非 ASCII 的 YAML 或 JSON。
- 精确替换。
- 未知历史编码。

核心规则很简单：不要把脆弱文本塞进 shell。小改动用 patch，复杂替换用显式 UTF-8 文件 I/O。

安全替换脚本：

```bash
node examples/safe-replace.mjs <targetFile> <oldTextFile> <newTextFile>
```

脚本会用 UTF-8 读写，保持 LF/CRLF 风格；如果找不到 oldText，不会修改目标文件。

## 7. Token Saving 说明

WinLean 从输入、输出和返工三个地方节省 token。

减少输入：

- 默认不读 `node_modules`、`.git`、`dist`、`build`、`out`、`.next`、`.nuxt`、`coverage`、`.cache`、`.turbo`、`.vite`、`vendor`、`generated`、二进制、图片、压缩包和 lock file。
- 先搜索，再打开最相关的小文件或片段。
- 路径清楚后停止继续读。

减少输出：

- 写代码前先复用框架能力、公共库、已有依赖和本地 helper。
- 简单需求不新建 helper、type、service layer。
- 局部 patch，不整文件重写。
- 小问题不为了“看起来完整”新建大量测试脚手架。

减少返工：

- 避免 Windows 编码失败。
- 避免换行不匹配。
- 避免脆弱 shell one-liner。

## 8. Lean Code Rules 说明

- 先问这段代码是否真的需要存在。
- 优先使用框架原生能力。
- 常见成熟领域优先考虑公共库，但要评估依赖成本。
- 优先复用项目已有代码。
- 行为不变时优先删除而不是新增。
- 不添加未使用 helper、类型、class、wrapper、service layer。
- 不重复造轮子。
- 不做无关重构。
- 注释要少，但要解释真正的限制或取舍。

## 9. 如何在项目中使用

在任务里显式引用：

```text
Use winlean-coding full. Make the smallest Windows-safe patch. Check dependency options before custom code. Verify the diff.
```

小型低风险任务：

```text
Use winlean-coding lite. Read only the directly relevant files and run the smallest verification.
```

只审查不修改：

```text
Use winlean-coding audit. Review this diff for Windows risk, token waste, dependency choices, and overbuilding.
```

## 10. 如何配合 AGENTS.md

把 `examples/AGENTS.md` 复制到目标项目根目录。它会要求 Agent：

- 默认使用 `winlean-coding`。
- 不读依赖目录和生成目录。
- Windows 下不使用 PowerShell one-liner 修改非 ASCII 文本。
- 写代码前先复用框架能力、公共库、已有依赖和项目工具。
- 小步修改。
- 检查 `git diff`。
- 运行最小必要验证命令。

## 11. 示例使用场景

Windows 中文 Markdown：

```text
Use winlean-coding full. Update this Chinese Markdown prompt. Do not use PowerShell one-liners. Preserve UTF-8 and LF.
```

前端日期格式化：

```text
Use winlean-coding full. Before writing date logic, check framework capability, existing dependencies, and mature date/time libraries. Ask before adding a production dependency.
```

修 bug：

```text
Use winlean-coding full. Find the root cause, patch the smallest shared location, and run the nearest test.
```

只审查 diff：

```text
Use winlean-coding audit. Check this patch for generated-file edits, unnecessary dependencies, whole-file rewrites, and missing verification.
```

## 12. 推荐输出格式

```text
Changed
- ...

Dependency Decision
- External libraries checked: yes/no/unable to verify.
- External library used: yes/no.
- Reason: ...
- New dependency approval needed: yes/no.
- Why not handwritten: ...

Reused
- ...

Avoided
- ...

Verified
- ...

Risks
- ...
```

## 13. 验证与 benchmark

验证 Skill 本身：

```bash
node scripts/validate-skill.mjs
```

仓库中还包含项目构建 smoke benchmark。2026-06-30 的 Codex CLI 实测中，WinLean 在同一任务上比 Ponytail 使用了更少的 processed、uncached、output 和 reasoning tokens。完整结果见仓库根目录的 `benchmarks/project-build-smoke/results-codex-2026-06-30.md`。
