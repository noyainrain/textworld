PYTHON=python3
PYTHONFLAGS=-W error
PIP=pip3
PIPFLAGS=--upgrade --upgrade-strategy=eager

.PHONY: test
test:
	-$(PYTHON) $(PYTHONFLAGS) -m unittest

.PHONY: type
type:
	-mypy

.PHONY: check
check: type test

.PHONY: dependencies-dev
dependencies-dev:
	$(PIP) install $(PIPFLAGS) --requirement=requirements-dev.txt
