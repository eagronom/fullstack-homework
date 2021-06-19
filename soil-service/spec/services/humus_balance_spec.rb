require 'rails_helper'

RSpec.describe HumusBalanceService do
  describe '#get_balance' do
    it 'throw without field_id' do
      params = {}
      expect { HumusBalanceService.instance.get_balance(params) }.to raise_error ApiExceptions::HumusBalanceError::MissingFieldIdError
    end

    it 'throw when field_id does not exists' do
      params = {
        field_id: 10
      }
      expect { HumusBalanceService.instance.get_balance(params) }.to raise_error ApiExceptions::HumusBalanceError::FieldDoesNotExistError
    end

    it 'throw when crop does not exists' do
      params = {
        field_id: 1,
        years:{
          "2021": 1000
        }
      }
      expect { HumusBalanceService.instance.get_balance(params) }.to raise_error ApiExceptions::HumusBalanceError::CropDoesNotExistError
    end

    it 'return humus balance' do
      params = {
        field_id: 1,
        years:{
          "2021": 1
        }
      }
      expect(HumusBalanceService.instance.get_balance(params)).to match(
          field_id: an_instance_of(Integer),
          humus_balance: an_instance_of(Float),
          previous_humus_balance: an_instance_of(Float)
      )
    end
  end
end
