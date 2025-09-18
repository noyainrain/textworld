PIP=pip3
PIPFLAGS=--upgrade --upgrade-strategy=eager

.PHONY: type
type:
	-mypy

.PHONY: check
check: type

.PHONY: dependencies-dev
dependencies-dev:
	$(PIP) install $(PIPFLAGS) --requirement=requirements-dev.txt
