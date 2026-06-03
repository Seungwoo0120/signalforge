/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "hsl(var(--canvas))",
        panel: "hsl(var(--panel))",
        panelMuted: "hsl(var(--panel-muted))",
        borderSoft: "hsl(var(--border-soft))",
        textPrimary: "hsl(var(--text-primary))",
        textMuted: "hsl(var(--text-muted))",
        accent: "hsl(var(--accent))",
        accentSoft: "hsl(var(--accent-soft))",
        success: "hsl(var(--success))",
        danger: "hsl(var(--danger))",
        warning: "hsl(var(--warning))"
      },
      boxShadow: {
        panel: "0 16px 38px rgba(15, 23, 42, 0.07)",
        focus: "0 0 0 3px hsl(var(--accent-soft))"
      }
    }
  },
  plugins: []
};
