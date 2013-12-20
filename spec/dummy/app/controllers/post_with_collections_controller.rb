class PostWithCollectionsController < ApplicationController
  before_action :set_post_with_collection, only: [:show, :edit, :update, :destroy]

  # GET /post_with_collections
  def index
    @post_with_collections = PostWithCollection.all
  end

  # GET /post_with_collections/1
  def show
  end

  # GET /post_with_collections/new
  def new
    @post_with_collection = PostWithCollection.new
  end

  # GET /post_with_collections/1/edit
  def edit
  end

  # POST /post_with_collections
  def create
    @post_with_collection = PostWithCollection.new(post_with_collection_params)

    if @post_with_collection.save
      redirect_to @post_with_collection, notice: 'Post with collection was successfully created.'
    else
      render action: 'new'
    end
  end

  # PATCH/PUT /post_with_collections/1
  def update
    if @post_with_collection.update(post_with_collection_params)
      redirect_to @post_with_collection, notice: 'Post with collection was successfully updated.'
    else
      render action: 'edit'
    end
  end

  # DELETE /post_with_collections/1
  def destroy
    @post_with_collection.destroy
    redirect_to post_with_collections_url, notice: 'Post with collection was successfully destroyed.'
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post_with_collection
      @post_with_collection = PostWithCollection.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def post_with_collection_params
      params.require(:post_with_collection).permit(:title, :file)
    end
end
