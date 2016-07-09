class CreateEmails < ActiveRecord::Migration
  def change
    create_table :emails do |t|
      t.string :to
      t.string :from
      t.text :subject
      t.text :body

      t.timestamps null: false
    end
  end
end
