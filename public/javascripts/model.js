/* global $ */
/* global angular */
(function() {
    "use strict";
	window.Note = function Note() {
		this.ID = "";
		this.Name = "";
		this.Content = "";
		this.ParentID = -1;
		
		// Admin.
		this.CreatedAt = new Date();
		this.CreatedBy = "";
		this.LastChangedAt = new Date();
		this.LastChangedBy = "";
	}
	
	window.Note.prototype.fromJSON = function(jsonData) {
		this.ID = jsonData.ID;
		this.Name = jsonData.Name;
		this.Content = jsonData.Content;
		this.ParentID = jsonData.ParentID;
		this.CreatedAt = jsonData.CreatedAt;
		this.CreatedBy = jsonData.CreatedBy;
		this.LastChangedAt = jsonData.LastChangedAt;
		this.LastChangedBy = jsonData.LastChangedBy;
	}
	
	// Writing the algorithms 
}());
