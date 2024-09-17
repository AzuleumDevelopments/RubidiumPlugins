install({
  name: "Template Plugin", // Plugin Name
  description: "Template Plugin useful for Developers",
  icon: "add" // Icon from https://fonts.google.com/icons
}, function(event, end) {
  console.log(event);
  end();
});
