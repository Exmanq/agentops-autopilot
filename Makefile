PNPM ?= pnpm

setup:
	corepack enable || true
	$(PNPM) install
	$(PNPM) exec husky install

lint:
	$(PNPM) lint

test:
	$(PNPM) test

typecheck:
	$(PNPM) typecheck

build:
	$(PNPM) build

demo:
	$(PNPM) demo

doctor:
	node scripts/doctor.js

format:
	$(PNPM) format

clean:
	rm -rf node_modules .turbo **/node_modules **/dist **/.next

.PHONY: setup lint test typecheck build demo doctor format clean
