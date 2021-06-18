#COLORS
GREEN  := $(shell tput -Txterm setaf 2)
WHITE  := $(shell tput -Txterm setaf 7)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

# Add the following 'help' target to your Makefile
# And add help text after each target name starting with '\#\#'
# A category can be added with @category
HELP_FUN = \
	%help; \
	while(<>) { push @{$$help{$$2 // 'options'}}, [$$1, $$3] if /^([a-zA-Z\-]+)\s*:.*\#\#(?:@([a-zA-Z\-]+))?\s(.*)$$/ }; \
	print "usage: make [target]\n\n"; \
	for (sort keys %help) { \
	print "${WHITE}$$_:${RESET}\n"; \
	for (@{$$help{$$_}}) { \
	$$sep = " " x (32 - length $$_->[0]); \
	print "  ${YELLOW}$$_->[0]${RESET}$$sep${GREEN}$$_->[1]${RESET}\n"; \
	}; \
	print "\n"; }

.PHONY: help
help: ##@other Show this help.
	@perl -e '$(HELP_FUN)' $(MAKEFILE_LIST)


# Stack operations
.PHONY: build
build: ##@stack Build services
	@docker-compose build

.PHONY: start
start: ##@stack Starts services
	@docker-compose up -d

.PHONY: stop
stop: ##@stack Stops services
	@docker-compose stop

.PHONY: status
status: ##@stack Report container statuses
	@docker-compose ps

.PHONY: restart
restart: stop start ##@stack Restarts all containers, only use if things go bad

.PHONY: clean
clean: stop ##@stack Cleans up everything
	@docker-compose rm --force -v


RUN_BACKEND_COMMAND = docker-compose run --rm soil-service

.PHONY: specs
specs: ##@rails run specs
	$(RUN_BACKEND_COMMAND) bundle exec rspec

# Other utils

.PHONY: cli
cli: ##@stack SSH to the container
	$(RUN_BACKEND_COMMAND) bash

.PHONY: tail
tail: ##@stack Tail container logs
	@docker-compose logs -f