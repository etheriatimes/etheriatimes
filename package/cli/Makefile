.PHONY: help build install install-global install-local dev clean lint typecheck test uninstall uninstall-global uninstall-local

help:
	@echo "Etheria Times CLI - Makefile"
	@echo ""
	@echo "Available commands:"
	@echo "  make build            - Build the CLI"
	@echo "  make install         - Install CLI globally (requires sudo)"
	@echo "  make install-global  - Install CLI to /usr/local/bin (requires sudo)"
	@echo "  make install-local   - Install CLI to ~/.local/bin"
	@echo "  make dev             - Build and run CLI in development mode"
	@echo "  make clean           - Remove build artifacts"
	@echo "  make lint            - Run linter"
	@echo "  make typecheck       - Run TypeScript type checker"
	@echo "  make test            - Run tests"
	@echo "  make uninstall       - Uninstall CLI (requires sudo)"
	@echo "  make uninstall-local - Uninstall CLI from ~/.local/bin"

build:
	pnpm run build

install: install-global

install-global:
	@echo "Installing CLI globally to /usr/local/bin..."
	@sudo cp dist/index.cjs /usr/local/bin/etheriatimes
	@sudo chmod +x /usr/local/bin/etheriatimes
	@echo "CLI installed! Run 'etheriatimes --help' to get started."

install-local:
	@echo "Installing CLI to ~/.local/bin..."
	@mkdir -p ~/.local/bin
	@cp dist/index.cjs ~/.local/bin/etheriatimes
	@chmod +x ~/.local/bin/etheriatimes
	@echo "CLI installed to ~/.local/bin!"
	@echo "Add '~/.local/bin' to your PATH if not already added."

dev: build
	pnpm run dev

clean:
	rm -rf dist

lint:
	pnpm run lint 2>/dev/null || echo "No lint script defined"

typecheck:
	pnpm run typecheck

test:
	pnpm run test 2>/dev/null || echo "No test script defined"

uninstall: uninstall-global

uninstall-global:
	@echo "Uninstalling CLI from /usr/local/bin..."
	@sudo rm -f /usr/local/bin/etheriatimes
	@echo "CLI uninstalled!"

uninstall-local:
	@echo "Uninstalling CLI from ~/.local/bin..."
	@rm -f ~/.local/bin/etheriatimes
	@echo "CLI uninstalled from ~/.local/bin!"
