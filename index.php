<?php
echo preg_replace('/ manifest=".*?"/',"",file_get_contents("index.html"),1);