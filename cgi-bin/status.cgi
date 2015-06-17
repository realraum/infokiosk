#!/usr/bin/perl
use strict;
use CGI::Carp qw(fatalsToBrowser);
use CGI qw/:standard/;
print "Content-type:application/json\n";
print "Pragma: no-cache\n";
print "Cache-Control: no-cache\n";
print "Access-Control-Allow-Origin: *\n";
print "\n";
exists $ENV{"STATUS_UPDATE_KEY"} or die("Sorry I don't know my key");
my $filename = '/dev/shm/www/status.json';
if (param('set') && param('pass') eq $ENV{"STATUS_UPDATE_KEY"})
{
  my $fh;
  open $fh,">$filename";
  print $fh param('set');
  close $fh;
}
my $fh;
open $fh,"<$filename";
while(<$fh>) { print };
