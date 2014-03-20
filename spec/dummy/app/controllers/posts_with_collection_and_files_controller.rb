class PostsWithCollectionAndFilesController < ApplicationController
  before_action :set_posts_with_collection_and_file, only: [:show, :edit, :update, :destroy]

  # GET /posts_with_collection_and_files
  def index
    @posts_with_collection_and_files = PostsWithCollectionAndFile.all
  end

  # GET /posts_with_collection_and_files/1
  def show
  end

  # GET /posts_with_collection_and_files/new
  def new
    @posts_with_collection_and_file = PostsWithCollectionAndFile.new
  end

  # GET /posts_with_collection_and_files/1/edit
  def edit
  end

  # POST /posts_with_collection_and_files
  def create
    @posts_with_collection_and_file = PostsWithCollectionAndFile.new(posts_with_collection_and_file_params)

    if @posts_with_collection_and_file.save
      redirect_to @posts_with_collection_and_file, notice: 'Posts with collection and file was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /posts_with_collection_and_files/1
  def update
    if @posts_with_collection_and_file.update(posts_with_collection_and_file_params)
      redirect_to @posts_with_collection_and_file, notice: 'Posts with collection and file was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /posts_with_collection_and_files/1
  def destroy
    @posts_with_collection_and_file.destroy
    redirect_to posts_with_collection_and_files_url, notice: 'Posts with collection and file was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_posts_with_collection_and_file
      @posts_with_collection_and_file = PostsWithCollectionAndFile.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def posts_with_collection_and_file_params
      params[:posts_with_collection_and_file]
    end
end
