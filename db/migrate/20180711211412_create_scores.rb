class CreateScores < ActiveRecord::Migration[5.2]
  def change
    create_table :scores do |t|
      t.integer :score_count, null: false
      t.string :name, null: true, default: 'anonymous'

      t.timestamps
    end
  end
end
