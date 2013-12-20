class CreatePostWithCollections < ActiveRecord::Migration
  def change
    create_table :post_with_collections do |t|
      t.string :title
      t.string :file

      t.timestamps
    end
  end
end
