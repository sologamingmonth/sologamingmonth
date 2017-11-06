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

var SGAMgplus = (function ( $ ) {

    /*
        Private members
    */
    const TEMPLATE = ({ url, title, published, actor, access, object }) => `
        <li class=".post">
            <h2 class="post-list__post-title post-title"><a href="${url}" title="${title}">${title}</a></h2>
            <p class="excerpt">${object.content}&hellip;</p>
            <div class=post-list__meta>
		 <strong>[${access.description}]</strong>
				&#8226; <span class="post-meta__tags">${object.plusoners.totalItems} <strong><em>+1<sup>s</sup></em></strong>
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
    const EXCERPT_WORDCOUNT = 150;
    const FEED_SELECTOR = '#gplus-tag-feed';
    const FIELDS_REQUIRED = 'nextPageToken,items/url,items/title,items/published,'
                          + 'items/access/description,items/actor(url,displayName),'
                          + 'items/object(content,plusoners/totalItems,replies/totalItems)';
    const MAX_RESULTS = 10;
    const SEARCH_QUERY = '#SGAM | #SGAM2017';
    
    var PageToken;

    /**
     * Start the app by setting the API key and loading the client
     */
    function init() {      
        // gapi.load('client', function() {
            // gapi.client.setApiKey(API_KEY)     
            // gapi.client.load('plus','v1').then(loadHashtags);
        // });
        
        gapi.load('client', initClient);
    
        // Bind pagination to the scroll event
        //$(document).scroll(infiniteScroll);
    }
    
    /**
     * Initializes the g+ api client
     */
    function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/plus/v1/rest']
        }).then(infiniteScroll)
    }
    
    /**
     * Search g+ activities for hashtag(s) and 
     *  render results to the template.
     */
    function loadHashtags() {       
        // Query the API
        gapi.client.plus.activities.search({
          'query'       : SEARCH_QUERY,
          'fields'      : FIELDS_REQUIRED,
          'maxResults'  : MAX_RESULTS,
          'pageToken'   : PageToken
        }).then(function(response) {
            
            // Convert to JSON
            var result = $.parseJSON(response.body);
            var items = result.items;
            
            // Set up pagination in return object
            if(PageToken !== result.nextPageToken 
                && items.length === MAX_RESULTS) {
                PageToken = result.nextPageToken;
            }
            else {
                PageToken = null;
            }

            // Create an excerpt of the content           
            $.each(items, function(k, v) {
                    v.object.content = v.object.content.split(' ')
                        .splice(0,EXCERPT_WORDCOUNT).join(' ');
            });

            // Map activityResource to HTML template
            $(FEED_SELECTOR).append(items.map(TEMPLATE).join(''));
        
        }, function(reason) {
            console.log('Error: ' + reason.result.error.message);
        }).then(function() {
            if(PageToken) {
                $(document).scroll(infiniteScroll);
            }
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
        // See if the last <li> is within view
        if ( shouldScroll( FEED_SELECTOR + ' li:last') ) {

            // Stop the pagination
            $(document).unbind('scroll');
            
            // Load more stuff
            loadHashtags();
        };
    }
    
    return{
        /*
            Public members
        */
        
        /**
         * Initialize the application
         */
        go: function(){
            //$(document).ready(function () {
                init();
            //});
        },
        
        /**
         * Render g+ comments on comment-enabled pages.
         */
        renderComments: function() {
            // gapi.commentcount.render('commentscounter', {
            //     href: window.location
            // });

            gapi.comments.render('comments', {
                href: window.location,
                width: (window.screen.availWidth * .08),
                first_party_property: 'BLOGGER',
                view_type: 'FILTERED_POSTMOD'
            });
        }
    };

// Pull in jQuery
})( jQuery );

//SGAMgplus.startApp();

function startApp() {
    SGAMgplus.go();
}

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