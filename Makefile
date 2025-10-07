PYTHON=python3
PYTHONFLAGS=-W error
PIP=pip3
PIPFLAGS=--upgrade --upgrade-strategy=eager
PYLINTFLAGS=
NPM=npm
NPMFLAGS=--no-package-lock

.PHONY: test
test:
	$(PYTHON) $(PYTHONFLAGS) -m unittest

.PHONY: type
type:
	mypy
	-$(NPM) --prefix=client run type

.PHONY: lint
lint:
	pylint $(PYLINTFLAGS) textworld

.PHONY: check
check: type test lint

.PHONY: dependencies
dependencies:
	$(PIP) install $(PIPFLAGS) --requirement=requirements.txt

.PHONY: dependencies-dev
dependencies-dev:
	$(PIP) install $(PIPFLAGS) --requirement=requirements-dev.txt
	$(NPM) --prefix=textworld/res/client update $(NPMFLAGS)
