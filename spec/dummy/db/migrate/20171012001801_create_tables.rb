superclass = ActiveRecord::Migration
superclass = ActiveRecord::Migration[5.0] if superclass.respond_to?(:[])

class CreateTables < superclass
  def change
    create_table :posts do |t|
      t.string :title
      t.string :file

      t.timestamps
    end

    create_table :post_with_collections do |t|
      t.string :title
      t.string :group

      t.timestamps
    end

    create_table :posts_with_collection_and_files do |t|
      t.string :title
      t.string :file
      t.string :group
      t.timestamps
    end

    create_table :post_with_two_collections do |t|
      t.string :title
      t.string :group_1
      t.string :group_2
      t.timestamps
    end

    create_table :post_with_two_files do |t|
      t.string :title
      t.string :file_1
      t.string :file_2
      t.timestamps
    end
  end
end
