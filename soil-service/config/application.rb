require_relative 'boot'

require 'rails'
require 'active_model/railtie'
require 'action_controller/railtie'
require 'action_view/railtie'
require 'rails/test_unit/railtie'

Bundler.require(*Rails.groups)

module SoilService
  class Application < Rails::Application
    config.load_defaults 6.1

    config.generators.system_tests = nil

    config.autoload_paths += %W[
      #{config.root}/app/services
    ]
  end
end
