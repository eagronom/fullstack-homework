module ApiExceptions
  class BaseException < StandardError
    include ActiveModel::Serialization
    attr_reader :status, :message

    ERROR_DESCRIPTION = Proc.new {|status, message| {status: status, message: message}}
    ERROR_CODE_MAP = {
      "HumusBalanceError::MissingFieldIdError" =>
        ERROR_DESCRIPTION.call(400, "item_id is required"),
        "HumusBalanceError::FieldDoesNotExistError" =>
        ERROR_DESCRIPTION.call(404, "field not found")
    }

    def initialize
      error_type = self.class.name.scan(/ApiExceptions::(.*)/).flatten.first
      ApiExceptions::BaseException::ERROR_CODE_MAP
        .fetch(error_type, {}).each do |attr, value|
          instance_variable_set("@#{attr}".to_sym, value)
      end
    end
  end
end