class AddOtherFileToPostWithCollections < ActiveRecord::Migration[5.2]
  def change
    add_column :post_with_collections, :other_file, :string
  end
end
