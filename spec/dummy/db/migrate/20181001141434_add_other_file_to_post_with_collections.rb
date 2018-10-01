superclass = ActiveRecord::Migration
superclass = ActiveRecord::Migration[5.0] if superclass.respond_to?(:[])

class AddOtherFileToPostWithCollections < superclass
  def change
    add_column :post_with_collections, :other_file, :string
  end
end
