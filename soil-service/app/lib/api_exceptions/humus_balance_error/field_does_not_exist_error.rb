module ApiExceptions
    class HumusBalanceError < ApiExceptions::BaseException
      class FieldDoesNotExistError < ApiExceptions::HumusBalanceError
      end
    end
  end