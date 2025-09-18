PIP=pip3
PIPFLAGS=--upgrade --upgrade-strategy=eager

.PHONY: check
check:

.PHONY: dependencies-dev
dependencies-dev:
	$(PIP) install $(PIPFLAGS) --requirement=requirements-dev.txt
