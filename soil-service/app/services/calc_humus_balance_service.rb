class CalcHumusBalanceService
  include Singleton

  CONSEQ_YEAR_COEF = 1.3

  def get_humus_balance(body)
    return unless body.present?
    seasonal_crops = JSON.parse(body)
    calc_humus_balance(seasonal_crops)
  end

  private

  def calc_humus_balance(seasonal_crops)
      sorted_crops = sort_seasonal_crops(seasonal_crops).map {|seasonal_crop| seasonal_crop['crop']}
      previous_crop_value = nil
      humus_balance = 0
      sorted_crops.each do |crop|
        humus_delta = crop['humus_delta']
        humus_balance += previous_crop_value == crop['value'] ? humus_delta * CONSEQ_YEAR_COEF : humus_delta
        previous_crop_value = crop['value']
      end
      humus_balance
    end

    def sort_seasonal_crops(seasonal_crops)
      seasonal_crops.sort_by {|crop| crop['year']}
    end
end
