# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171012001801) do

  create_table "post_with_collections", force: :cascade do |t|
    t.string "title"
    t.string "group"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "post_with_two_collections", force: :cascade do |t|
    t.string "title"
    t.string "group_1"
    t.string "group_2"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "post_with_two_files", force: :cascade do |t|
    t.string "title"
    t.string "file_1"
    t.string "file_2"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "posts", force: :cascade do |t|
    t.string "title"
    t.string "file"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "posts_with_collection_and_files", force: :cascade do |t|
    t.string "title"
    t.string "file"
    t.string "group"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
