module Fields
  class HumusBalanceService
    MULTIPLY_EFFECT = 1.3

    def initialize(crops:)
      @crops = crops
    end

    def call
      humus_balance = crops.each_with_index.reduce(0) do |total_humus, (humus_delta, index)|
        effect = index.zero? ? 1 : MULTIPLY_EFFECT
        (humus_delta + total_humus ) * effect
      end
      humus_balance.round(2)
    end

    private
    attr_reader :crops
  end
end
