class HumusBalanceController < ActionController::Base
  rescue_from ApiExceptions::BaseException,
    :with => :render_error_response
  
    def index
        render json: HumusBalanceService.instance.get_balance(balance_calculation_parameters)      
    end

    def balance_calculation_parameters
      params.permit(:field_id, years: {})
    end

    def render_error_response(error)
      render json: { message: error.message }, status: error.status
    end
  end