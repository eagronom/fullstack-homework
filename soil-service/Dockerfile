FROM ruby:3.0.0

# throw errors if Gemfile has been modified since Gemfile.lock
RUN bundle config --global frozen 1
WORKDIR /code
COPY . /code/
RUN bundle install
EXPOSE 3000
CMD ["/code/start.sh"]