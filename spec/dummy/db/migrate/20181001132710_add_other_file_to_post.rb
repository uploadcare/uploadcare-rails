superclass = ActiveRecord::Migration
superclass = ActiveRecord::Migration[5.0] if superclass.respond_to?(:[])

class AddOtherFileToPost < superclass
  def change
    add_column :posts, :other_file, :string
  end
end
