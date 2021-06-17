class HumusBalanceController < ActionController::Base
    def index
      render json: HumusBalanceService.instance.get_balance(balance_calculation_parameters)
    end

    def balance_calculation_parameters
      params.permit(:field_id, parameters: {})
    end
  end