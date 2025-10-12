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

.PHONY: test-client
test-client:
	-$(NPM) --prefix=textworld/res/client run test

test-ui:
	$(PYTHON) $(PYTHONFLAGS) -m unittest textworld.tests.ui_test

.PHONY: type
type:
	mypy
	-$(NPM) --prefix=client run type

.PHONY: lint
lint:
	pylint $(PYLINTFLAGS) textworld
	-$(NPM) --prefix=client run lint

.PHONY: check
check: type test test-client test-ui lint

.PHONY: dependencies
dependencies:
	$(PIP) install $(PIPFLAGS) --requirement=requirements.txt

.PHONY: dependencies-dev
dependencies-dev:
	$(PIP) install $(PIPFLAGS) --requirement=requirements-dev.txt
	$(NPM) --prefix=textworld/res/client update $(NPMFLAGS)
