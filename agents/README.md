# Custom Subagents Guide

This directory contains the definitions and prompts for two specialized AI agents designed to perform code reviews, design audits, and optimizations.

---

## 1. General Design & Code Optimization Agent (`general_optimizer`)
A generalist frontend agent that focuses on UI code reviews, performance, Tailwind CSS v4, and general code simplification.

### Attached Skills
Whenever this agent runs, it automatically reads and applies the following installed skills:
1. **Modern Web Guidance**: [modern-web-guidance](file:///Users/arunachalam/.gemini/config/plugins/modern-web-guidance-plugin/skills/modern-web-guidance/SKILL.md)
2. **React Component Performance**: [react-component-performance](file:///Users/arunachalam/.gemini/config/skills/react-component-performance/SKILL.md)
3. **Code Simplification**: [simplify-code](file:///Users/arunachalam/.gemini/config/skills/simplify-code/SKILL.md)
4. **Performance Profiling**: [performance-profiling](file:///Users/arunachalam/.gemini/config/skills/performance-profiling/SKILL.md)
5. **LCP Debugging**: [debug-optimize-lcp](file:///Users/arunachalam/.gemini/config/plugins/chrome-devtools-plugin/skills/debug-optimize-lcp/SKILL.md)
6. **Code Reviewer**: [code-reviewer](file:///Users/arunachalam/.gemini/config/skills/code-reviewer/SKILL.md)
7. **UI/UX Pro Max**: [ui-ux-pro-max](file:///Users/arunachalam/.gemini/config/skills/ui-ux-pro-max/SKILL.md)
8. **Web Performance Optimization**: [web-performance-optimization](file:///Users/arunachalam/.gemini/config/skills/web-performance-optimization/SKILL.md)
9. **UX/UI Principles**: [uxui-principles](file:///Users/arunachalam/.gemini/config/skills/uxui-principles/SKILL.md)
10. **UI Review**: [ui-review](file:///Users/arunachalam/.gemini/config/skills/ui-review/SKILL.md)
11. **UI/UX Designer**: [ui-ux-designer](file:///Users/arunachalam/.gemini/config/skills/ui-ux-designer/SKILL.md)
12. **Frontend Dev Guidelines**: [frontend-dev-guidelines](file:///Users/arunachalam/.gemini/config/skills/frontend-dev-guidelines/SKILL.md)
13. **Vercel React Best Practices**: [vercel-react-best-practices](file:///Users/arunachalam/.gemini/config/skills/vercel-react-best-practices/SKILL.md)
14. **Vercel Deployment**: [vercel-deployment](file:///Users/arunachalam/.gemini/config/skills/vercel-deployment/SKILL.md)
15. **Tailwind CSS**: [tailwindcss](file:///Users/arunachalam/.gemini/config/skills/tailwindcss/SKILL.md)
16. **Tailwind CSS v4**: [tailwindcss-v4](file:///Users/arunachalam/.gemini/config/skills/tailwindcss-v4/SKILL.md)
17. **Tailwind CSS Animations**: [tailwindcss-animations](file:///Users/arunachalam/.gemini/config/skills/tailwindcss-animations/SKILL.md)
18. **Using Superpowers**: [using-superpowers](file:///Users/arunachalam/.gemini/config/skills/using-superpowers/SKILL.md)
19. **Superpowers Lab**: [superpowers-lab](file:///Users/arunachalam/.gemini/config/skills/superpowers-lab/SKILL.md)
20. **TypeScript Pro**: [typescript-pro](file:///Users/arunachalam/.gemini/config/skills/typescript-pro/SKILL.md)
21. **TypeScript Advanced Types**: [typescript-advanced-types](file:///Users/arunachalam/.gemini/config/skills/typescript-advanced-types/SKILL.md)
22. **TypeScript Expert**: [typescript-expert](file:///Users/arunachalam/.gemini/config/skills/typescript-expert/SKILL.md)
23. **React Best Practices**: [react-best-practices](file:///Users/arunachalam/.gemini/config/skills/react-best-practices/SKILL.md)
24. **React Doctor**: [react-doctor](file:///Users/arunachalam/.gemini/config/skills/react-doctor/SKILL.md)
25. **React Flow Architect**: [react-flow-architect](file:///Users/arunachalam/.gemini/config/skills/react-flow-architect/SKILL.md)
26. **Find Skills**: [find-skills](file:///Users/arunachalam/.gemini/config/skills/find-skills/SKILL.md)

### System Prompt Copy
* Documented in: [general-optimizer.md](file:///Users/arunachalam/Documents/workspace/expense/tracker/agents/general-optimizer.md)

---

## 2. Expense Tracker Specialist Agent (`tracker_specialist`)
A project-specific agent that enforces the strict styling, architecture, design systems, and programming standards of the Expense Tracker codebase.

### Attached Skills & Workspace Files
Whenever this agent runs, it automatically loads:
1. **React Patterns**: [react-patterns](file:///Users/arunachalam/.gemini/config/skills/react-patterns/SKILL.md)
2. **Zustand Store Setup**: [zustand-store-ts](file:///Users/arunachalam/.gemini/config/skills/zustand-store-ts/SKILL.md)
3. **Shadcn Components**: [shadcn](file:///Users/arunachalam/.gemini/config/skills/shadcn/SKILL.md)
4. **StyleSeed UI Patterns**: [ui-pattern](file:///Users/arunachalam/.gemini/config/skills/ui-pattern/SKILL.md)
5. **UX Feedback States**: [ux-feedback](file:///Users/arunachalam/.gemini/config/skills/ux-feedback/SKILL.md)
6. **UI/UX Pro Max**: [ui-ux-pro-max](file:///Users/arunachalam/.gemini/config/skills/ui-ux-pro-max/SKILL.md)
7. **Web Design Guidelines**: [web-design-guidelines](file:///Users/arunachalam/.gemini/config/skills/web-design-guidelines/SKILL.md)
8. **UI Skills**: [ui-skills](file:///Users/arunachalam/.gemini/config/skills/ui-skills/SKILL.md)
9. **Tailwind CSS v4**: [tailwindcss-v4](file:///Users/arunachalam/.gemini/config/skills/tailwindcss-v4/SKILL.md)
10. **Tailwind CSS Animations**: [tailwindcss-animations](file:///Users/arunachalam/.gemini/config/skills/tailwindcss-animations/SKILL.md)
11. **Frontend Dev Guidelines**: [frontend-dev-guidelines](file:///Users/arunachalam/.gemini/config/skills/frontend-dev-guidelines/SKILL.md)
12. **Vercel React Best Practices**: [vercel-react-best-practices](file:///Users/arunachalam/.gemini/config/skills/vercel-react-best-practices/SKILL.md)
13. **Using Superpowers**: [using-superpowers](file:///Users/arunachalam/.gemini/config/skills/using-superpowers/SKILL.md)
14. **React Best Practices**: [react-best-practices](file:///Users/arunachalam/.gemini/config/skills/react-best-practices/SKILL.md)
15. **React Doctor**: [react-doctor](file:///Users/arunachalam/.gemini/config/skills/react-doctor/SKILL.md)
16. **TypeScript Pro**: [typescript-pro](file:///Users/arunachalam/.gemini/config/skills/typescript-pro/SKILL.md)
17. **Workspace Guidelines**:
   * [CLAUDE.md](file:///Users/arunachalam/Documents/workspace/expense/tracker/CLAUDE.md)
   * [.impeccable.md](file:///Users/arunachalam/Documents/workspace/expense/tracker/.impeccable.md)

### System Prompt Copy
* Documented in: [tracker-specialist.md](file:///Users/arunachalam/Documents/workspace/expense/tracker/agents/tracker-specialist.md)

---

## How to Invoke the Agents
You can invoke either of these agents in your conversation by using the `invoke_subagent` tool:

```json
{
  "Subagents": [
    {
      "TypeName": "tracker_specialist",
      "Role": "Code Reviewer",
      "Prompt": "Review src/App.jsx for any architectural and import-order violations and outline a plan to resolve them."
    }
  ]
}
```
