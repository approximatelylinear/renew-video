require 'test_helper'

class ReactHomepageControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get react_homepage_index_url
    assert_response :success
  end

end
