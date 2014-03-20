class CreatePostsWithCollectionAndFiles < ActiveRecord::Migration
  def change
    create_table :posts_with_collection_and_files do |t|
      t.string :title
      t.string :file
      t.string :group
      t.timestamps
    end
  end
end
