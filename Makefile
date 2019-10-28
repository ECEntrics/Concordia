build:
	@docker-compose -p apella build;
run:
	@docker-compose -p apella up -d
stop:
	@docker-compose -p apella down
clean-data: 
	@docker-compose -p apella down -v
clean-images:
	@docker rmi `docker images -q -f "dangling=true"`
