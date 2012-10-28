class CreateResumes < ActiveRecord::Migration
  def change
    create_table :resumes do |t|
      t.text :description
      t.string :name
      t.string :attachment

      t.timestamps
    end
  end
end
