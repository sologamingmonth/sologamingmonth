# Solo Gaming Appreciation Month 

This is the website for [Solo Gaming Appreciation Month](https://sologamingmonth.com) 
-- a community effort by the 
[Lone Wolf Role-playing Google+ group](https://plus.google.com/communities/116965157741523529510). 

**SGAM** occurs annually for the duration of November, and is dedicated to the enjoyment
of solitaire gaming. For more information, 
[visit the site!](https://sologamingmonth.com/about)

## Contributing

Submit pull requests directly to the `master` branch.

### Setup

The website is a static site created with [Jekyll](https://jekyllrb.com/), a command-line tool created 
by GitHub for use in Github Pages (which is the platform for the website).

You don't strictly have to download and install Jekyll to submit a post, but it is useful 
for previewing your posts in a locally-served instance of the website, or for making other 
changes to layout, CSS, JavaScript, etc. I won't get into the details here, but there are 
plenty of guides on the web for running Jekyll locally on your operating system of choice.

### Organization

The code is organized like most Jekyll projects, with posts going into the `/_posts` 
directory and templates in the `/_layout` and `_includes` directory. CSS is compiled from SASS.

The `index.html` file in the root folder is the landing page and kicks off the G+ javascript.

I've been creating a sgam<year>.md file in the root folder as well to aggregate information 
for each year. Otherwise, individual posts go in the `/_posts` directory. The `/news` directory 
contains another index.html file and serves as the "feed" for the posts in the `/_posts` 
directory.


### Creating a post

Create a new markdown file in the `_posts` directory with the `YYYY-MM-DD-post_name.md` file 
name format. Posts are written in the [Kramdown](https://kramdown.gettalong.org/syntax.html) 
syntax, which is a different flavor of [Markdown](https://daringfireball.net/projects/markdown/syntax).

The main thing is to not forget to add the YAML front-matter with a minimum of a `layout` and 
`title` specified. You can also create an author bio by supplying a file in the `/_authors` 
directory, but these currently aren't aggregated or displayed.

#### Kramdown Tables

Kramdown table syntax can be found [here](https://kramdown.gettalong.org/syntax.html#tables). 
If your table ends up too wide, breaking the responsive layout, 
add a wrapper `div` like so (keep the blank lines between the `<div>` elements and the markdown):

    <div style="overflow: auto;" markdown="block">
    
    | some | table | here |
    
    </div>

### Social Integration 

We've currently pulling in Google+ posts with an "activity" search based on the #SGAM and #SGAM<current year> 
hashtags. That code is in `/js/gplus.js` and G+ documentation is here: https://developers.google.com/+/web/

Comments are also supplied via G+ integration, "borrowed" from Bloggr.

In 2018, Google announced the sunset of Google+ and the Lone Wolf G+ community is feeling out 
various other platforms (MeWe, Discord, Reddit, etc.). At some point before SGAM 2018, it would be good to look into these 
other platforms and possible integration into the site with a similar hashtag feed, sharing, 
and home for comments
