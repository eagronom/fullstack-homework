class ApplicationService
  include Dry::Monads[:result, :do]

  def self.call(*args, &block)
    new(*args, &block).call
  end
end
