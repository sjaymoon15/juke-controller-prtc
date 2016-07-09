var juke = angular.module("juke", []);

juke.controller("AlbumCtrl", function($scope, $http, $log){

	$http.get("/api/albums")
	.then(function(res){
		return res.data;
	})
	.then(function(albums){
		return $http.get("/api/albums/"+ albums[0].id);
	})
	.then(function(res){
		return res.data;
	})
	.then(function(album){
		// console.log("album",album);
		$scope.album = album;
		console.log($scope.album);
		$scope.album.imageUrl = "/api/albums/" + album.id + "/image";
		album.songs.forEach(function(song){
			song.audioUrl = "/api/songs/" + song.id + "/audio";
			// song.index = songs.indexOf(song);
		})
		return album.songs;
	})
	.then(function(songs){
		$scope.songs = songs;
		songs.forEach(function(song){
			song.index = songs.indexOf(song);
		})
	})
	.catch($log.error);
	// var playing = false;

	var currentSong;
	$scope.playing = false;
	
	$scope.start = function(song){
		console.log('song',song);
		// console.log("song.audioUrl", song.audioUrl);
		console.log("song.index", song.index);
		if($scope.currentSong) {
			$scope.currentSong.audio.pause();
		}
		$scope.currentSong = song;
		$scope.currentSong.audio = document.createElement('audio');
		// console	.log('song.audio', song.audio);
		$scope.currentSong.audio.src = "/api/songs/" + song.id + "/audio";
		$scope.currentSong.audio.load();
		$scope.currentSong.audio.play();
		$scope.playing = true;	
		$scope.paused = false;
	};
	$scope.toggle = function(){
		// console.log('$scope.paused', $scope.paused);
		if(!$scope.paused){
			$scope.currentSong.audio.pause();
			$scope.paused = true;
		}else{
			$scope.currentSong.audio.play();
			$scope.paused = false;
		}
	}
	$scope.next = function(){
		// console.log("$scope.currentSong.index", $scope.currentSong.index);
		$scope.start($scope.songs[$scope.currentSong.index + 1]);		
	}
	$scope.prev = function(){
		$scope.start($scope.songs[$scope.currentSong.index - 1]);
	}

})

