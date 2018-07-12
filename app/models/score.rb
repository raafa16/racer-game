class Score < ApplicationRecord
  validates :score_count, presence: true
end
