class AddTechToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :tech, :string
  end
end
