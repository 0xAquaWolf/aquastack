# SelfVision Quest - Monorepo Linting & Formatting Setup

This document provides comprehensive setup instructions for the unified linting and formatting configuration using @antfu/eslint-config across the SelfVision Quest monorepo.

## Overview

The monorepo uses a unified linting and formatting approach:
- **ESLint + @antfu/eslint-config**: Handles all JavaScript/TypeScript formatting and linting
- **Prettier**: Limited to non-JS files (JSON, Markdown, YAML) only
- **Simple Git Hooks**: Automates linting on commit
- **Turbo + pnpm**: Monorepo management

## Architecture

### Root Level Configuration
- `eslint.config.js`: Unified ESLint configuration for entire monorepo
- `.prettierrc`: Prettier config for non-JS files only
- `.prettierignore`: Excludes JS/TS files from Prettier
- `package.json`: Centralized scripts and dependencies

### Package Level Integration
- Individual packages delegate to root commands
- No duplicate ESLint/Prettier configs
- Clean separation of concerns

## Commands

### Global Monorepo Commands
```bash
# Lint entire monorepo
pnpm lint

# Auto-fix linting issues
pnpm lint:fix

# Format non-JS files
pnpm format

# Check formatting without changes
pnpm format:check

# Type checking
pnpm type-check
```

### Package-Specific Commands
```bash
# Lint specific packages/apps
pnpm lint:web      # Web app only
pnpm lint:mobile   # Mobile app only
pnpm lint:ui       # UI package only
pnpm lint:shared   # Shared package only
```

### In-Package Commands
```bash
# From any package directory
pnpm lint          # Delegates to appropriate root command
```

## Neovim + LazyVim Configuration

### Prerequisites
- Neovim 0.9+
- LazyVim installed
- Mason (LSP/DAP/formatter installer)

### Configuration Setup

Create or update your LazyVim configuration:

#### 1. LSP Configuration (`lua/lsp/config.lua`)
```lua
return {
  "neovim/nvim-lspconfig",
  opts = {
    servers = {
      eslint = {
        settings = {
          -- Working with flat config
          useFlatConfig = true,
          -- Support monorepo
          rootDir = function()
            return vim.fn.getcwd()
          end,
          -- Enable auto-fix on save
          on_attach = function(client, bufnr)
            if client.server_capabilities.documentFormattingProvider then
              vim.api.nvim_create_autocmd("BufWritePre", {
                group = vim.api.nvim_create_augroup("EslintFixOnSave", { clear = true }),
                buffer = bufnr,
                command = "EslintFixAll",
              })
            end
          end,
        },
      },
      tsserver = {
        settings = {
          typescript = {
            preferences = {
              importModuleSpecifier = "relative",
            },
          },
          javascript = {
            preferences = {
              importModuleSpecifier = "relative",
            },
          },
        },
      },
    },
  },
}
```

#### 2. Formatting Configuration (`lua/formatting.lua`)
```lua
return {
  "stevearc/conform.nvim",
  opts = {
    formatters_by_ft = {
      javascript = { "eslint" },
      typescript = { "eslint" },
      javascriptreact = { "eslint" },
      typescriptreact = { "eslint" },
      json = { "prettier" },
      markdown = { "prettier" },
      yaml = { "prettier" },
      yml = { "prettier" },
    },
    format_on_save = {
      timeout_ms = 500,
      lsp_fallback = true,
    },
  },
}
```

#### 3. Null-LS/Linting Configuration (`lua/linting.lua`)
```lua
return {
  "nvimtools/none-ls.nvim",
  opts = function()
    local null_ls = require("null-ls")
    return {
      sources = {
        -- ESLint for JS/TS
        null_ls.builtins.diagnostics.eslint.with({
          condition = function(utils)
            return utils.root_has_file("eslint.config.js")
          end,
          diagnostics_format = "[eslint] #{m}",
        }),
        -- Prettier for non-JS files
        null_ls.builtins.formatting.prettier.with({
          condition = function(utils)
            return utils.root_has_file(".prettierrc") and
                   not (utils.root_has_file("package.json") and
                   vim.tbl_contains({"javascript", "typescript", "javascriptreact", "typescriptreact"},
                   vim.bo.filetype))
          end,
        }),
      },
    }
  end,
}
```

#### 4. Key Mappings (`lua/keymaps.lua`)
```lua
local opts = { noremap = true, silent = true }

-- LSP keymaps
vim.keymap.set("n", "<leader>lf", "<cmd>lua vim.lsp.buf.formatting_sync()<cr>", opts)
vim.keymap.set("n", "<leader>li", "<cmd>LspInfo<cr>", opts)

-- ESLint specific
vim.keymap.set("n", "<leader>ef", "<cmd>EslintFixAll<cr>", opts)
vim.keymap.set("n", "<leader>el", "<cmd>Eslint<cr>", opts)

-- Project-specific linting
vim.keymap.set("n", "<leader>pl", function()
  vim.cmd("term pnpm lint")
end, opts)

vim.keymap.set("n", "<leader>pf", function()
  vim.cmd("term pnpm lint:fix")
end, opts)
```

#### 5. Mason Setup (`lua/mason.lua`)
```lua
return {
  "williamboman/mason.nvim",
  opts = {
    ensure_installed = {
      "eslint-lsp",
      "prettier",
      "typescript-language-server",
      "tailwindcss-language-server",
    },
  },
}
```

### Installation Steps

1. **Install required plugins:**
   ```bash
   :MasonInstall eslint-lsp prettier typescript-language-server tailwindcss-language-server
   ```

2. **Add to your LazyVim configuration:**
   - Create `lua/plugins/` directory
   - Add the configuration files above
   - Update `init.lua` to include them

3. **Verify setup:**
   ```vim
   :LspInfo          # Check if ESLint is running
   :EslintFixAll     # Test ESLint fixing
   :ConformInfo      # Check formatters
   ```

### Troubleshooting

#### ESLint Not Working
- Check if `eslint.config.js` exists in root
- Verify ESLint LSP is installed via Mason
- Restart Neovim after configuration changes

#### Prettier Not Formatting
- Ensure file type is in `formatters_by_ft`
- Check that `.prettierrc` exists
- Verify Prettier is installed via Mason

#### Type Errors
- Ensure tsserver is running
- Check TypeScript workspace configuration
- Verify `tsconfig.json` files exist

#### Monorepo Issues
- Ensure you're in the root directory
- Check pnpm workspace configuration
- Verify all dependencies are installed

## File Structure

```
selfvision-quest/
├── eslint.config.js          # Unified ESLint config
├── .prettierrc               # Prettier for non-JS files
├── .prettierignore           # Excludes JS/TS files
├── package.json              # Root scripts & deps
├── apps/
│   ├── web/
│   │   └── package.json       # Delegates to root
│   └── mobile/
│       └── package.json       # Delegates to root
├── packages/
│   ├── ui/
│   │   └── package.json       # Delegates to root
│   └── shared/
│       └── package.json       # Delegates to root
└── docs/
    └── NEOVIM_SETUP.md        # This file
```

## Git Hooks

The setup includes pre-commit hooks that:
1. Run ESLint on JS/TS files with auto-fix
2. Format non-JS files with Prettier

### Manual Hook Setup
```bash
# Install hooks
pnpm prepare

# Test hooks
git commit -m "test"
```

## Best Practices

1. **Work from root directory** when running global commands
2. **Use package-specific commands** when working on individual components
3. **Run `pnpm lint:fix`** before committing to auto-fix issues
4. **Check type errors** with `pnpm type-check` before pushing
5. **Update Neovim plugins** regularly for latest features

## Contributing

When making changes to the linting setup:
1. Test across all packages/apps
2. Update documentation if configuration changes
3. Verify Git hooks work correctly
4. Test Neovim integration
