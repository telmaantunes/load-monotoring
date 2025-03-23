# Define PNPM command
PNPM := $(shell command -v pnpm)

# Default target
start: check_pnpm install_deps run_dev

# Check if PNPM is installed, install if missing
check_pnpm:
	@if ! command -v pnpm > /dev/null; then \
		echo "PNPM not found. Installing..."; \
		npm install -g pnpm; \
	else \
		echo "PNPM is already installed."; \
	fi

# Install dependencies using PNPM
install_deps:
	@pnpm install --frozen-lockfile

# Run the development server
run_dev:
	@pnpm run server

.PHONY: all check_pnpm install_deps run_dev