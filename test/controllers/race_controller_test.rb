require 'test_helper'

class RaceControllerTest < ActionDispatch::IntegrationTest
  test "should get start" do
    get race_start_url
    assert_response :success
  end

end
