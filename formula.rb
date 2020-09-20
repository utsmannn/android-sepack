class Sepack < Formula
	desc "Command-line interface for build android project base on MVVM"
	homepage "https://github.com/utsmannn/android-sepack"
	url "https://github.com/utsmannn/android-sepack/archive/0.1.1.tar.gz"
	sha256 "816cf4e38aa97935fbb9efdc0c36e516b40f677cf3f329acab355cf9286fe6f4"
	head "https://github.com/utsmannn/android-sepack.git"
	version "0.1.1"

	def install
		bin.install "sepack"
	end

	test do
		system "#{bin}/android-sepack"
	end
end