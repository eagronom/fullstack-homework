module ApiExceptions
  class HumusBalanceError < ApiExceptions::BaseException
    class MissingFieldIdError < ApiExceptions::HumusBalanceError
    end
  end
end