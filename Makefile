PYTHON=python3
PYTHONFLAGS=-W error
PIP=pip3
PIPFLAGS=--upgrade --upgrade-strategy=eager
PYLINTFLAGS=

.PHONY: test
test:
	-$(PYTHON) $(PYTHONFLAGS) -m unittest

.PHONY: type
type:
	-mypy

.PHONY: lint
lint:
	-pylint $(PYLINTFLAGS)

.PHONY: check
check: type test lint

.PHONY: dependencies
dependencies:
	$(PIP) install $(PIPFLAGS) --requirement=requirements.txt

.PHONY: dependencies-dev
dependencies-dev:
	$(PIP) install $(PIPFLAGS) --requirement=requirements-dev.txt
