require "spec_helper"

describe PostWithCollectionsController do
  describe "routing" do

    it "routes to #index" do
      get("/post_with_collections").should route_to("post_with_collections#index")
    end

    it "routes to #new" do
      get("/post_with_collections/new").should route_to("post_with_collections#new")
    end

    it "routes to #show" do
      get("/post_with_collections/1").should route_to("post_with_collections#show", :id => "1")
    end

    it "routes to #edit" do
      get("/post_with_collections/1/edit").should route_to("post_with_collections#edit", :id => "1")
    end

    it "routes to #create" do
      post("/post_with_collections").should route_to("post_with_collections#create")
    end

    it "routes to #update" do
      put("/post_with_collections/1").should route_to("post_with_collections#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/post_with_collections/1").should route_to("post_with_collections#destroy", :id => "1")
    end

  end
end
