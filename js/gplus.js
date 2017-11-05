---
layout: null
sitemap:
  exclude: 'yes'
---
/*
    G+ Integration for SGAM

    @author Spencer Salyer
    @url: http://sologamingmonth.com
    @date: %%buildDate%%
    @version: %%buildVersion%%
 */

var gplusSGAM = (function ( $ ) {

    /*
        Private members
    */
    const TEMPLATE = ({ url, title, excerpt, published, actor, access, object }) => `
        <li class=".post">
            <h2 class="post-list__post-title post-title"><a href="${url}" title="${title}">${title}</a></h2>
            <p class="excerpt">${object.content.split(" ").splice(0,300).join(" ")}&hellip;</p>
            <div class=post-list__meta>
		 <strong>[${access.description}]</strong>   &#8226;
				<span class="post-meta__tags">${object.plusoners.totalItems} <strong><em>+1<sup>s</sup></em></strong>
				| ${object.replies.totalItems} <strong><em>Replies</em></strong></span>

            </div>
            <div class="post-list__meta">
                <time datetime="${published}" class="post-list__meta--date date">${published}</time>
                &#8226; <span class="post-meta__tags">by <a href="${actor.url}">${actor.displayName}</a></span>
            </div>
            <hr class="post-list__divider">
        </li>
    `;

    const API_KEY = 'AIzaSyAFcDZXBXqX6y2K9EHmv6v3-w2oTekPIRA';

    /**
     * Start the app by setting the API key and loading the client
     */
    function init() {      
        gapi.load('auth2', function() {
            gapi.client.setApiKey(API_KEY)     
            gapi.client.load('plus','v1').then(loadHashtags);
        });
    
        // Bind pagination to the scroll event
        $(document).scroll(infiniteScroll);
    }
    
    /**
     * Search g+ activities for hashtag(s) and 
     *  render results to the template.
     */
    function loadHashtags() {
        var searchQuery = '#SGAM | #SGAM2017';
        var feedSelector = '#gplus-tag-feed';
        
        gapi.client.plus.activities.search({
          'query' : searchQuery
        }).then(function(response) {
            
            // Map activityResource to HTML template
            $(feedSelector).html(
                $.parseJSON(response.body).items.map(TEMPLATE).join('')
            );
        
        }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        });
    }
    
    /**
     * Add function to the onload event handler
     */
    function addOnload (handle) {
        if(window.attachEvent) {
            window.attachEvent('onload', handle);
        } else {
            if(window.onload) {
                var curronload = window.onload;
                var newonload = function(evt) {
                    curronload(evt);
                    handle(evt);
                };
                window.onload = newonload;
            } else {
                window.onload = handle;
            }
        }
    }
    
    /**
     * Determine if last paginated item has been reached
     */
    function shouldScroll(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
    
    /**
     * Pagination
     */
    function infiniteScroll() {
        if (shouldScroll(".post-list ol li:last")) {
            // Load more stuff
            $(document).unbind('scroll');
            
            // TODO: Convert to use GAPI / paginate
			$.ajax({
				type: "GET",
				url: "https://www.googleapis.com/plus/v1/activities",
				data: { 
                    query: '#SGAM #SGAM2017') 
                    //index_count: $('#index_count').attr('value'),json: "true"
                    // pageToken: nextPageToken
                }
			}).done(function( msg ) {
				$(".post-list ol").append(msg.html);
				$('#index_count').attr('value',msg.index_count);
				if (msg.count != 0) {
					$(document).scroll(function(e){
						//callback to the method to check if the user scrolled to the last element of your list/feed 
					})
				}
			});
        };
    }
    
    return{
        /*
            Public members
        */
        
        /**
         * Initialize the application
         */
        startApp: function(){
            $(document).ready(function () {
                init();
            });
        },
        
        /**
         * Render g+ comments on comment-enabled pages.
         */
        function renderComments() {
            // gapi.commentcount.render('commentscounter', {
            //     href: window.location
            // });

            gapi.comments.render('comments', {
                href: window.location,
                width: '300', // TODO: pct of window width
                first_party_property: 'BLOGGER',
                view_type: 'FILTERED_POSTMOD'
            });
        }
    };

// Pull in jQuery
})( jQuery );

gplusSGAM.startApp();


/*
    The above template maps to activityResource objects...
        see: https://developers.google.com/+/web/api/rest/latest/activities#resource-representations
    
    Example:
        {
          "kind": "plus#activity",
          "etag": etag,
          "title": string,
          "published": datetime,
          "updated": datetime,
          "id": string,
          "url": string,
          "actor": {
            "id": string,
            "displayName": string,
            "name": {
              "familyName": string,
              "givenName": string
            },
            "url": string,
            "image": {
              "url": string
            }
          },
          "verb": string,
          "object": {
            "objectType": string,
            "id": string,
            "actor": {
              "id": string,
              "displayName": string,
              "url": string,
              "image": {
                "url": string
              }
            },
            "content": string,
            "originalContent": string,
            "url": string,
            "replies": {
              "totalItems": unsigned integer,
              "selfLink": string
            },
            "plusoners": {
              "totalItems": unsigned integer,
              "selfLink": string
            },
            "resharers": {
              "totalItems": unsigned integer,
              "selfLink": string
            },
            "attachments": [
              {
                "objectType": string,
                "displayName": string,
                "id": string,
                "content": string,
                "url": string,
                "image": {
                  "url": string,
                  "type": string,
                  "height": unsigned integer,
                  "width": unsigned integer
                },
                "fullImage": {
                  "url": string,
                  "type": string,
                  "height": unsigned integer,
                  "width": unsigned integer
                },
                "embed": {
                  "url": string,
                  "type": string
                },
                "thumbnails": [
                  {
                    "url": string,
                    "description": string,
                    "image": {
                      "url": string,
                      "type": string,
                      "height": unsigned integer,
                      "width": unsigned integer
                    }
                  }
                ]
              }
            ]
          },
          "annotation": string,
          "crosspostSource": string,
          "provider": {
            "title": string
          },
          "access": {
            "kind": "plus#acl",
            "description": string,
            "items": [
              {
                "type": string,
                "id": string,
                "displayName": string
              }
            ]
          },
          "geocode": string,
          "address": string,
          "radius": string,
          "placeId": string,
          "placeName": string,
          "location": {
            "kind": "plus#place",
            "id": string,
            "displayName": string,
            "position": {
              "latitude": double,
              "longitude": double
            },
            "address": {
              "formatted": string
            }
          }
        }

*/





