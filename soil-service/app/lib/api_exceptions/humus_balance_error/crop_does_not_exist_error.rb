module ApiExceptions
    class HumusBalanceError < ApiExceptions::BaseException
      class CropDoesNotExistError < ApiExceptions::HumusBalanceError
      end
    end
  end